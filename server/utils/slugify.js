const _ = require("lodash");

const slugify = (text) => _.kebabCase(text);

async function generateSlug(Model, name, filter = {}) {
  const oriSlug = slugify(name);

  const user = await Model.findOne(
    Object.assign({ slug: oriSlug }, filter),
    "id"
  );
  if (!user) {
    return oriSlug;
  }

  return createUniqueSlug(Model, oriSlug, 1);
}

async function createUniqueSlug(Model, oriSlug, count) {
  const user = await Model.findOne({ slug: `${oriSlug}-${count}` }, "id");
  if (!user) {
    return `${oriSlug}-${count}`;
  }

  return createUniqueSlug(Model, oriSlug, count + 1);
}

module.exports = generateSlug;
