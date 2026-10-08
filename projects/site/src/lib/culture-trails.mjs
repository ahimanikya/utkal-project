// A connected trail is useful only when every promised reading doorway exists.
export function selectCultureTrails(trails, {path, all = false, allowsPage = () => true} = {}) {
 return trails.filter(trail => (all || trail.show_on.includes(path)) && trail.links.every(link => allowsPage(link.href)));
}
