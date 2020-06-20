import { Args } from './../utils/types';
import {md,html} from "devkeeper-plugin-core";

interface VuePressArgs extends Args {
  dev: boolean;
}

const describe = "Creates VuePress site. Also creates API section using TypeDoc.";
const builder = {
  "dev": { type: "boolean", describe: "Run VuePress in development mode." }
};

async function handler({intermodular, devkeeper, dev}: VuePressArgs): Promise<void> {
  if (dev) {
    await intermodular.targetModule.command("vuepress dev docs");
    return;
  }

  // npm-run-all -p typedoc:md typedoc:html && rm -rf docs/nav.02.api docs/.vuepress/public/api-site && mv api-docs-md docs/nav.02.api && mv api-docs-html docs/.vuepress/public/api-site && cp assets/typedoc/01.typedoc-iframe.md docs/nav.02.api/ && NODE_ENV=production vuepress build docs
  const mdPath = "docs/nav.02.api";
  const htmlPath = "docs/.vuepress/public/api-site";
  const iframePath = "module-files/01.typedoc-iframe.md";

  await Promise.all([md({intermodular,devkeeper, out: mdPath }), html({intermodular, devkeeper,  out: htmlPath })]);
  await intermodular.copy(iframePath, mdPath); // Don't put this in `Promise.all` with `md` and `html`. It needs first directory created. Otherwise file is copied same name with directory, since there is no directory yet.
  await intermodular.targetModule.execute("vuepress", ["build", "docs"], { env: { NODE_ENV: "production" } });
  intermodular.log("info", "VuePress site updated.");
};

export { describe, builder, handler };
