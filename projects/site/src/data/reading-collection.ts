import collection from '../../../../kb/research/destinations/coastal-reading-collection.json';
export {collection};
export const collectionChapter=(path:string)=>collection.chapters.findIndex(chapter=>chapter.href===path);
