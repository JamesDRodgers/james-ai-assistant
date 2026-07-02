module.exports = function (eleventyConfig) {
  // CSS/JS for the templated pages (index/portfolio/resume/jamesrodgers).
  eleventyConfig.addPassthroughCopy("src/assets");

  // Case-study / proposal pages: bespoke one-off documents, copied byte-identical.
  eleventyConfig.addPassthroughCopy("PAC_Portfolio_Snapshot.html");
  eleventyConfig.addPassthroughCopy("Python_Portfolio_Snapshot.html");
  eleventyConfig.addPassthroughCopy("swim_science_snapshot.html");
  eleventyConfig.addPassthroughCopy("ymca_aquatics_snapshot.html");
  eleventyConfig.addPassthroughCopy("usher-training.html");
  eleventyConfig.addPassthroughCopy("sb_proposal.html");
  eleventyConfig.addPassthroughCopy("swim");

  // Images, PDFs, and other binary assets referenced (by root-relative path)
  // from both the templated pages and the passthrough case-study pages above.
  eleventyConfig.addPassthroughCopy("Canvas_Logo.jpg");
  eleventyConfig.addPassthroughCopy("Instructional Designer Resume Rodgers.pdf");
  eleventyConfig.addPassthroughCopy("LaneMgmt.png");
  eleventyConfig.addPassthroughCopy("PAC_Bot.png");
  eleventyConfig.addPassthroughCopy("PAC_Review.png");
  eleventyConfig.addPassthroughCopy("Python_Intro_GP.ipynb");
  eleventyConfig.addPassthroughCopy("Rodgers_AI_tutor_Resume.pdf");
  eleventyConfig.addPassthroughCopy("ScanningDeck.png");
  eleventyConfig.addPassthroughCopy("Slide_Deck_Pac.png");
  eleventyConfig.addPassthroughCopy("Smith_Stroke_Trends_2026_ (2).png");
  eleventyConfig.addPassthroughCopy("door.jpeg");
  eleventyConfig.addPassthroughCopy("headshot.png");
  eleventyConfig.addPassthroughCopy("hypoxic.png");
  eleventyConfig.addPassthroughCopy("jupyter_GP1.png");
  eleventyConfig.addPassthroughCopy("math_homework.jpeg");
  eleventyConfig.addPassthroughCopy("og-image.png");
  eleventyConfig.addPassthroughCopy("swanz.jpg");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
