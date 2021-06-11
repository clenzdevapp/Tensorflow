url='https://www.kaggle.com/apratim87/housingdata/download'

function* numGenerator(){
    const max = 6;
    let zahl = 1;
    while (zahl <= max) {
        const x = zahl;
        zahl++;
        yield x;        
    }
}

async function datasetsCreate(){
    tf.setBackend('cpu');

    //const ds = tf.data.array([1,2,3,4,5,6]);
    //const ds = tf.data.generator(numGenerator);
    const ds = tf.data.csv();

    //Asynchroner Aufruf einer selbst programmierten Funktion
    await ds.forEachAsync(e => console.log(e));
}