import * as tsp from "@typespec/compiler";
import { readFile, rm } from "fs/promises";

export const parse = async (code: string) => {
	await tsp.compile(tsp.NodeHost, code, {
		emit: ["@typespec/openapi3"],
	});

	const outputFilePath = "./@typespec/openapi3/openapi.yaml";
	const outputFile = await readFile(outputFilePath, "utf8");
	console.log(outputFile);
	await rm(outputFilePath, { force: true });

	return outputFile;
};
