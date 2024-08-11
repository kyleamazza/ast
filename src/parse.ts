import { AST } from ".";
import { parse as parseJson } from "./json";
import { parse as parseYaml } from "./yaml";
import { parse as parseTsp } from "./typespec";

export const parse = async (doc, docType) => {
	if (true || docType === "tsp") {
		const file = await parseTsp(doc);
		const yaml = parseYaml(file);
		console.log("baml", yaml);
		return yaml;
	}
	return doc.trimStart().startsWith("{") ? parseJson(doc) : parseYaml(doc);
};

parse("./src/example.tsp", "tsp").then(() => {
	console.log("donezo");
});
