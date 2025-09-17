const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const validateStringField = (path: string, value: unknown, errors: string[]) => {
  if (!isNonEmptyString(value)) {
    errors.push(`${path} debe ser un string no vacío.`);
  }
};

const validateNestedArray = (
  data: unknown,
  path: string,
  errors: string[],
  callback: (value: Record<string, unknown>, index: number) => void
) => {
  if (!Array.isArray(data) || data.length === 0) {
    errors.push(`${path} debe ser un array con al menos un elemento.`);
    return;
  }

  data.forEach((item, index) => {
    if (!isPlainObject(item)) {
      errors.push(`${path}[${index}] debe ser un objeto.`);
      return;
    }

    callback(item as Record<string, unknown>, index);
  });
};

export const validateBowtieJson = (value: unknown): string[] => {
  const errors: string[] = [];

  if (!isPlainObject(value)) {
    errors.push("El Bowtie debe ser un objeto JSON.");
    return errors;
  }

  const bowtie = value as Record<string, unknown>;

  validateStringField("Bowtie.hazard", bowtie.hazard, errors);
  validateStringField("Bowtie.element", bowtie.element, errors);

  validateNestedArray(bowtie.threat_actions, "Bowtie.threat_actions", errors, (threat, index) => {
    validateStringField(`Bowtie.threat_actions[${index}].name`, threat.name, errors);
    validateStringField(`Bowtie.threat_actions[${index}].actors`, threat.actors, errors);
    validateStringField(`Bowtie.threat_actions[${index}].IEF`, threat.IEF, errors);

    validateNestedArray(
      threat.controls,
      `Bowtie.threat_actions[${index}].controls`,
      errors,
      (control, controlIndex) => {
        validateStringField(
          `Bowtie.threat_actions[${index}].controls[${controlIndex}].name`,
          control.name,
          errors
        );
        validateStringField(
          `Bowtie.threat_actions[${index}].controls[${controlIndex}].status`,
          control.status,
          errors
        );
      }
    );
  });

  validateNestedArray(bowtie.consequences, "Bowtie.consequences", errors, (consequence, index) => {
    validateStringField(`Bowtie.consequences[${index}].name`, consequence.name, errors);
    validateStringField(`Bowtie.consequences[${index}].severity`, consequence.severity, errors);
    validateStringField(
      `Bowtie.consequences[${index}].failure_mode`,
      consequence.failure_mode,
      errors
    );

    validateNestedArray(
      consequence.safeguards,
      `Bowtie.consequences[${index}].safeguards`,
      errors,
      (safeguard, safeguardIndex) => {
        validateStringField(
          `Bowtie.consequences[${index}].safeguards[${safeguardIndex}].name`,
          safeguard.name,
          errors
        );
        validateStringField(
          `Bowtie.consequences[${index}].safeguards[${safeguardIndex}].status`,
          safeguard.status,
          errors
        );
      }
    );
  });

  return errors;
};

export default validateBowtieJson;
