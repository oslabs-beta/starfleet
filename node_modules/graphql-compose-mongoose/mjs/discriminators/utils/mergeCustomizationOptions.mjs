import { mergeTypeConverterResolverOpts } from './mergeTypeConverterResolversOpts';
export function mergeStringAndStringArraysFields(baseField, childField, argOptsTypes) {
  if (Array.isArray(argOptsTypes)) {
    if (argOptsTypes.find(v => v === 'string' || v === 'string[]')) {
      return mergeStringAndStringArraysFields(baseField, childField, 'string');
    }
  }

  let merged = childField;

  if (argOptsTypes === 'string' || argOptsTypes === 'string[]') {
    if (!baseField) {
      if (childField) {
        return Array.isArray(childField) ? childField : [childField];
      }

      return undefined;
    }

    if (!childField) {
      if (baseField) {
        return Array.isArray(baseField) ? baseField : [baseField];
      }

      return undefined;
    }

    merged = Array.of(...(Array.isArray(baseField) ? baseField : [baseField]), ...(Array.isArray(childField) ? childField : [childField]));
    let length = merged.length;

    for (let i = 0; i <= length; i++) {
      for (let j = i + 1; j < length; j++) {
        if (merged[i] === merged[j]) {
          merged.splice(j, 1);
          length--;
        }
      }
    }
  }

  return merged;
}
export function mergeFieldMaps(baseFieldMap, childFieldMap) {
  if (!baseFieldMap) {
    return childFieldMap;
  }

  const mergedFieldMap = childFieldMap || {};

  for (const key in baseFieldMap) {
    if (baseFieldMap.hasOwnProperty(key)) {
      mergedFieldMap[key] = mergeStringAndStringArraysFields(baseFieldMap[key], mergedFieldMap[key], 'string');
    }
  }

  return mergedFieldMap;
}
export function mergeCustomizationOptions(baseCOptions, childCOptions) {
  if (!baseCOptions) {
    return childCOptions;
  }

  const mergedOptions = childCOptions || {};

  if (baseCOptions.schemaComposer !== mergedOptions.schemaComposer && mergedOptions.schemaComposer) {
    throw new Error('[Discriminators] ChildModels should have same schemaComposer as its BaseModel');
  } // use base schemaComposer


  mergedOptions.schemaComposer = baseCOptions.schemaComposer; // merge fields map

  if (baseCOptions.fields) {
    mergedOptions.fields = mergeFieldMaps(baseCOptions.fields, mergedOptions.fields);
  } // merge inputType fields map


  if (baseCOptions.inputType && baseCOptions.inputType.fields) {
    if (mergedOptions.inputType) {
      mergedOptions.inputType.fields = mergeFieldMaps(baseCOptions.inputType.fields, mergedOptions.inputType.fields);
    } else {
      mergedOptions.inputType = {
        fields: mergeFieldMaps(baseCOptions.inputType.fields, undefined)
      };
    }
  }

  mergedOptions.resolvers = mergeTypeConverterResolverOpts(baseCOptions.resolvers, mergedOptions.resolvers);
  return mergedOptions;
}