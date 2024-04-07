const mongoose = require("mongoose");
const _ = require("lodash");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = mongoose.model("EmailTemplate", mongoSchema);

async function getEmailTemplate(name, params) {
  const et = await EmailTemplate.findOne({ name });
  if (!et) {
    throw new Error("No EmailTemplate found!");
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}

async function insertTemplates() {
  const templates = [
    {
      name: "welcome",
      subject: "Welcome to builderbook.org",
      message: `<%= userName %>,
        <p>
          Thanks for signing up for Builder Book!
        </p>
        <p>
          In our books, we teach you how to build complete, production-ready web apps from scratch.
        </p>

        Dao Pham, Builder Book Demo
      `,
    },
  ];

  for (const t of templates) {
    const et = await EmailTemplate.findOne({ name: t.name });
    const message = t.message.replace(/\n/g, "").replace(/[ ]+/g, " ").trim();

    if (!et) {
      EmailTemplate.create({ ...t, message });
    } else {
      EmailTemplate.updateOne(
        { _id: et._id },
        { $set: { message, subject: t.subject } }
      ).exec();
    }
  }
}

exports.getEmailTemplate = getEmailTemplate;
exports.insertTemplates = insertTemplates;
