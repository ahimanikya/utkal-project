import {mountHomeArt} from './home-art.mjs';
import {mountFeaturedStories} from './featured-stories.mjs';

// Resolve the displayed image (including its fallback) before choosing the story trio.
export async function mountHomepageStories(document, {artOptions,storyOptions} = {}) {
  const art=document.querySelector('[data-home-art]');
  const theme=art ? await mountHomeArt(art,artOptions) : undefined;
  document.querySelectorAll('[data-featured-stories]').forEach(root=>mountFeaturedStories(root,{...storyOptions,theme}));
}
