async function calculate(){
    tf.setBackend('cpu');

    const a = tf.randomNormal([2,3]);
    a.print();
    console.log(a.shape);
    console.log(a.dtype);

    const b = a.clone();
    b.print();

    const c= a.add(b);
    c.print();

    const d = c.reshape([3,2]);
    d.print();

    const e = tf.tensor([1,2,3,4],[2,2]);
    const f = e.square();
    f.print();
    //Asynchrone Array-Konvertierung
    //array => Vektor | Matrix
    //data => Immer Vektor
    f.array().then(ergebnis => console.log(ergebnis));

    //Synchrone Array-Konvertierung
    console.log(f.arraySync());


}