"""Build isolated design studies from the existing, credited Chilika collection."""
from pathlib import Path
import json
from html import escape as e

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
story = json.loads((ROOT / 'kb/research/stories/narratives/chilika.json').read_text())
destination = json.loads((ROOT / 'kb/research/destinations/chilika.json').read_text())
assets = HERE / 'assets'
if not assets.exists():
    assets.symlink_to('../../site/public', target_is_directory=True)

fonts = HERE / 'font-assets'
if not fonts.exists():
    fonts.symlink_to('../../design-system/fonts', target_is_directory=True)

def photo(key, css=''):
    p = story['image'] if key == 'hero' else destination['visuals'][key]
    return f'<img class="{css}" src="assets{e(p["src"])}" alt="{e(p["alt"])}" width="{p["width"]}" height="{p["height"]}" loading="{"eager" if key == "hero" else "lazy"}">'

nav = '<nav class="chapters" aria-label="In this story"><a href="#story">The story</a><a href="#places">Choose a shore</a><a href="#food">At the table</a><a href="#visit">Plan a visit</a></nav>'
brand = '<img class="brand" src="assets/assets/brand-v3/utkal-project-en-colour.svg" alt="Utkal Project" width="805" height="140">'
header = f'<header class="masthead"><a href="#top" aria-label="Utkal Project">{brand}</a><span>Rediscover Utkal. Reimagine Odisha.</span><a href="#places">Explore Odisha ↗</a></header>'
intro = '<p class="kicker">Odisha · Water, memory & wonder</p><h1>Chilika<span lang="or">ଚିଲିକା</span></h1><p class="deck">Choose a shore.<br><em>Take your time.</em></p>'
button = '<a class="button" href="#places">Find your Chilika <span>↗</span></a>'
voice = story['voice']
poem = f'<blockquote><p lang="or">{e(voice["original"]).replace(chr(10),"<br>")}</p><p class="translation">{e(voice["translation"])}</p><footer>{e(voice["author"])} · <cite>Chilika-Darshan</cite></footer></blockquote>'
story_section = f'''<section class="chapter story" id="story"><div class="chapter-label"><span>01</span><p class="kicker">A place to linger</p></div><div class="story-copy"><h2>A poet asks<br>the train to <em>wait.</em></h2><p class="reading">{e(story['opening'])}</p>{poem}</div><figure>{photo('mangalajodi')}<figcaption>Mangalajodi · a sky full of wings</figcaption></figure></section>'''
cards = ''
for index, item in enumerate(destination['experiences']):
    key = item.get('image_ref', 'hero')
    titles = ['Begin with the birds.', 'Cross into a story.', 'Leave room for surprise.']
    # Satapada uses a clearly labelled regional image, not a false specific location.
    caption = 'Chilika · regional view' if key == 'hero' else destination['visuals'][key]['caption']
    cards += f'''<article class="shore-card"><figure>{photo(key)}<figcaption>{e(caption)}</figcaption></figure><div><p class="kicker">{e(item['area'])}</p><h3>{titles[index]}</h3><p>{e(item['text'])}</p><details><summary>More about this shore</summary><p>{e(destination['places'][index]['text'])}</p><a href="http://127.0.0.1:4324{e(item['detail_href'])}" target="_blank" rel="noopener">Read the existing guide ↗</a></details></div></article>'''
places = f'<section class="chapter places" id="places"><div class="section-heading"><div><p class="kicker">Three ways into the lagoon</p><h2>One lagoon.<br><em>Your kind of day.</em></h2></div><p>Choose what draws you here. Give one shore a day, with room for a meal and the journey back.</p></div><div class="shore-grid">{cards}</div></section>'
food = f'''<section class="chapter food" id="food"><figure>{photo('crab')}<figcaption>A photographed serving · not a reviewed restaurant</figcaption></figure><div><p class="kicker">At the table</p><h2>The lagoon has<br>a <em>flavour, too.</em></h2><p class="reading">{e(destination['foods'][1]['text'])}</p><div class="food-note"><h3>Ask about the day’s fish</h3><p>{e(destination['foods'][0]['text'])}</p></div><details><summary>And something from the dairy</summary><p>{e(destination['foods'][2]['text'])}</p></details></div></section>'''
belief = f'''<details class="belief"><summary>The island that keeps a name · Kalijai’s local legend</summary><p>{e(story['belief']['text'])}</p><p>{e(story['belief']['qualification'])}</p></details>'''
visit = f'''<section class="chapter visit" id="visit"><div><p class="kicker">Make room for a slower day</p><h2>Come with curiosity.<br><em>Leave room for Chilika.</em></h2><p class="reading">A few choices make the day your own. Start with a shore, a season and someone who knows the water.</p></div><div class="visit-notes"><div><span>When</span><p>{e(destination['season'])}</p></div><div><span>With whom</span><p>Ask a local guide what has changed in the wetland. Agree on the service and price; ask before photographing people at work.</p></div><div><span>Stay</span><p>Research a base near your chosen shore. Confirm access, rooms and current operations with the property before booking.</p></div><a class="button" href="http://127.0.0.1:4324/journey/" target="_blank" rel="noopener">Open the existing journey planner ↗</a></div></section>'''
credits = '<details class="credits"><summary>Sources, photographs & editorial notes</summary><p>Design study using the existing Utkal Project research. Editorial preview, not new travel verification. Original English narration by Utkal Project; Founder & Editor-in-Chief: Ahimanikya Satapathy. Poem rendering and Odia copy await language review.</p><ul>'
for p in [story['image'], *destination['visuals'].values()]:
    credits += f'<li><a href="{e(p["source"])}">{e(p["title"])}</a> — {e(p["creator"])} · <a href="{e(p["license_url"])}">{e(p["license"])}</a>. Display crops vary; photographs are not AI-generated.</li>'
credits += '</ul><a href="http://127.0.0.1:4324/knowledge/chilika/#sources-credits" target="_blank" rel="noopener">Full research and literary source notes ↗</a></details>'
for variant in ['a', 'b', 'c']:
    if variant == 'a':
        hero = f'<section class="hero"><div class="hero-copy">{intro}{button}</div><figure>{photo("hero")}<figcaption>Chilika, Odisha · a boat and birds on open water</figcaption></figure><div class="hero-foot"><span>A living landscape. A day of your own.</span><a href="#story">Begin the story ↓</a></div></section>'
        contents = story_section + places + belief + food + visit
    elif variant == 'b':
        hero = f'<section class="hero">{photo("hero")}<div class="hero-copy">{intro}<a href="#story" class="down">Step into the story ↓</a></div><span class="image-note">Chilika · water, sky and a passing boat</span></section>'
        contents = story_section + places + belief + food + visit
    else:
        hero = f'<section class="hero"><div class="hero-copy">{intro}<p class="reading">Birds at Mangalajodi. Belief at Kalijai. A day on the water from Satapada. Which shore is yours?</p>{button}</div><figure>{photo("hero")}<figcaption>Chilika · regional view</figcaption></figure><aside class="quick-start"><p class="kicker">Start here</p><h3>Give one shore a day.</h3><p><strong>Birding season</strong><br>November–February at Mangalajodi</p><p><strong>Before a boat trip</strong><br>Agree on departure, route and return.</p><a href="#visit">The practical details ↓</a></aside></section>'
        contents = places + food + story_section + belief + visit
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Chilika · Direction {variant.upper()} · Utkal design study</title><link rel="stylesheet" href="styles.css"></head><body class="direction-{variant}" id="top"><a class="skip" href="#story">Skip to the story</a>{header}<main>{hero}{nav}<div class="content">{contents}{credits}</div></main><footer class="page-footer">{brand}<p>Rediscover Utkal. Reimagine Odisha.</p><a href="#top">Back to the beginning ↑</a></footer></body></html>'''
    (HERE / f'{variant}.html').write_text(html)
print('Built three isolated design studies. Existing website files unchanged.')
