import type { ParseError } from "jsonc-parser";
import { FileFormat } from "../../enums/file.enum";
import { validateBowtieJson } from "./validateBowtie";

export const contentToJson = (value: string, format = FileFormat.JSON): Promise<object> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!value) return resolve({});

      if (format !== FileFormat.JSON) {
        throw new Error("Solo se admiten archivos Bowtie en formato JSON.");
      }

      const { parse } = await import("jsonc-parser");
      const errors: ParseError[] = [];
      const result = parse(value, errors);

      if (errors.length > 0) {
        JSON.parse(value);
      }

      const validationErrors = validateBowtieJson(result);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join("\n"));
      }

      return resolve(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to parse content";
      return reject(errorMessage);
    }
  });
};

export const jsonToContent = async (json: string, format: FileFormat): Promise<string> => {
  return new Promise(async resolve => {
    try {
      if (!json) return resolve("");

      if (format === FileFormat.JSON) {
        const parsedJson = JSON.parse(json);
        return resolve(JSON.stringify(parsedJson, null, 2));
      }

      if (format === FileFormat.YAML) {
        const { dump } = await import("js-yaml");
        const { parse } = await import("jsonc-parser");
        return resolve(dump(parse(json)));
      }

      if (format === FileFormat.XML) {
        const { XMLBuilder } = await import("fast-xml-parser");
        const builder = new XMLBuilder({
          format: true,
          attributeNamePrefix: "$",
          ignoreAttributes: false,
        });

        return resolve(builder.build(JSON.parse(json)));
      }

      if (format === FileFormat.CSV) {
        const { json2csv } = await import("json-2-csv");
        const parsedJson = JSON.parse(json);

        const data = Array.isArray(parsedJson) ? parsedJson : [parsedJson];
        return resolve(
          json2csv(data, {
            expandArrayObjects: true,
            expandNestedObjects: true,
            excelBOM: true,
            wrapBooleans: true,
            trimFieldValues: true,
            trimHeaderFields: true,
          })
        );
      }

      return resolve(json);
    } catch (error) {
      console.error(json, error);
      return resolve(json);
    }
  });
};
