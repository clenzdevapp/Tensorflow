async function getData() {
  //FUNKTION 1 Hole Daten
  const carsDataResponse = await fetch(
    "https://storage.googleapis.com/tfjs-tutorials/carsData.json"
  );
  const carsData = await carsDataResponse.json();
  const cleaned = carsData
    .map((car) => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter((car) => car.mpg != null && car.horsepower != null);

  return cleaned; //Rückgabewert = Gefilterte Menge von Cars
}

async function run() {
  //FUNKTION 2 Starte das Programm
  const data = await getData(); //Aufruf von FUNKTION 1
  const values = data.map((d) => ({
    x: d.horsepower,
    y: d.mpg,
  }));

  tfvis.render.scatterplot(
    //Erstellung des Graphen
    {
      name: "Horsepower v MPG",
    }, //Überschrift
    {
      values,
    },
    {
      xLabel: "Alpacapower",
      yLabel: "MPG",
      height: 300,
    }
  );

  const tensorData = convertToTensor(data);
  const { inputs, labels } = tensorData;

  await trainModel(model, inputs, labels);
  console.log('Done Training');

  testModel(model, data, tensorData);
}

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [1],
      units: 1,
      useBias: true,
    })
  ); //INPUT Layer

  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
    })
  ); //OUTPUT Layer

  return model;
}

function convertToTensor(data) {
  return tf.tidy(() => {
    //1 VORBEREITUNG
    tf.util.shuffle(data); //Zufälliges Shuffeln / Zerlegen der Daten für ein validere Testdatenmenge

    //2 KONVERTIERUNG IN TENSOREN
    const inputs = data.map((d) => d.horsepower); //Array für Eingabewerte
    const labels = data.map((d) => d.mpg); //Array für Ausgabewerte

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]); //Konvertierung in zweidimensionalen Tensor für Eingabewerte
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]); //Konvertierung in zweidimensionalen Tensor für Ausgawerte

    //NORMALISIERUNG DER DATEN
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

async function trainModel(model, inputs, labels) {
  //1 VORBEREITUNG
  model.compile({
    //Kompilierung des Modells
    optimizer: tf.train.adam(), //Optimierung durch den Adam-Algorithmus
    loss: tf.losses.meanSquaredError, //Verlustfunktion
    metrics: ["mse"], //Metrik: meanSquaredError
  });

  const batchSize = 32; //Datenmenge
  const epochs = 75; //Epochen

  //2 TRAINING
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,//Shufflen vor jedem neuen Trainingslauf
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "mse"],
      { height: 200, callbacks: ["onEpochEnd"] }
    ),
  });
}

function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin);

    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] }
  });

  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg,
  }));

  tfvis.render.scatterplot(
    { name: 'Model Predictions vs Original Data' },
    { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  );
}

document.addEventListener("DOMContentLoaded", run); //Aufruf von FUNKTION 2

const model = createModel();

tfvis.show.modelSummary(
  {
    name: "Model Summary",
  },
  model
);
