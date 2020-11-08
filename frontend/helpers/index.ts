import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 *
 * @param urls
 * @param nombre
 */
export function download_urls(urls: string[], nombre) {
  /* Create a new instance of JSZip and a folder named 'collection' where*/
  /* we will be adding all of our files*/
  let zip = new JSZip();
  let folder = zip.folder(nombre);

  /* Generate a zip file asynchronously and trigger the download */

  urls.forEach(async function (url) {
    // Fetch the image and parse the response stream as a blob
    const imageBlob = await fetch(url).then((response) => response.blob());
    // create a new file from the blob object
    const imageFile = new File([imageBlob], 'filename.jpg');
    /* Add the image to the folder */
    folder.file(url, imageFile);
    folder.generateAsync({ type: 'blob' }).then((content) => saveAs(content, nombre));
  });
}
