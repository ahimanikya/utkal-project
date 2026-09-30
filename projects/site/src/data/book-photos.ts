import regions from '../../../../kb/research/destinations/regions.json';
import voices from '../../../../kb/research/voices/collection.json';
import foods from '../../../../kb/research/food/collection.json';
import chilika from '../../../../kb/research/destinations/chilika.json';
import konark from '../../../../kb/research/destinations/konark.json';
import chilikaStory from '../../../../kb/research/stories/narratives/chilika.json';
import bookImages from '../../../../kb/research/destinations/book-images.json';
export const bookPhotos={
 'place:bhubaneswar':regions.assets.mukteswar,
 'experience:bhubaneswar-fresco':regions.assets['fresco-procession'],
 'place:mukteswar':regions.assets['mukteswar-torana'],
 'place:puri':regions.assets['puri-beach'],
 'place:puri-beach':regions.assets['puri-beach'],
 'place:cuttack':regions.assets.barabati,
 'place:barabati':regions.assets.barabati,
 'place:dhauli':regions.assets.dhauli,
 'place:raghurajpur':regions.assets['raghurajpur-artisan'],
 'place:chilika':chilikaStory.image,
 'place:konark':bookImages.assets['konark-wheel'],
 'place:chandipur':regions.assets['chandipur-panorama'],
 'place:similipal':regions.assets[regions.regions.find(r=>r.slug==='mayurbhanj').hero],
 'place:mangalajodi':chilika.visuals.mangalajodi,
 'experience:chilika-mangalajodi-birding':chilika.visuals['mangalajodi-boat'],
 'place:kalijai':chilika.visuals.kalijai,
 'place:chandrabhaga':konark.visuals.chandrabhaga,
 'food:konark-chhena-poda':foods.assets['chhena-poda'],
 'food:baripada-mudhi-mansa':foods.assets['mudhi-mansa'],
 'reading:people/pratibha-ray':voices.assets.ray,
 'reading:people/gopinath-mohanty':voices.assets.gopinath,
 'reading:people/bhima-bhoi':voices.assets['bhima-memorial']
};
