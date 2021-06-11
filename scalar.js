async function scalar() {
    tf.setBackend('cpu');

    const mytensor = tf.scalar(5, 'int32');
    mytensor.print();
    console.log(mytensor.dtype);
}