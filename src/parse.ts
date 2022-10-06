import { AST } from '.';
import { parse as parseJson } from './json';
import { parse as parseYaml } from './yaml';

export const parse: AST.ParseFunction = (doc) =>
  doc.trimStart().startsWith('{') ? parseJson(doc) : parseYaml(doc);
