/**
 * Verbindung zu Tensorflow erfolgt über die referenzierte HTML-Datei
 */
//const tf = require('@tensorflow/tfjs');
//import '@tensorflow/tfjs-backend-wasm';

async function main() {
    tf.setBackend('cpu');

    const mytensor = tf.tensor([1,2,3,4,5,6,7,8,9,10,11,12], [2,3,2]);
    
    mytensor.print(); 

    const mytensor2d = tf.tensor2d([[1,2],[3,4]]);

    mytensor2d.print();
    
}