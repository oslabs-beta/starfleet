import { ObjectTypeComposer } from 'graphql-compose';
import { prepareChildResolvers } from './prepareChildResolvers';
import { reorderFields } from './utils/reorderFields'; // copy all baseTypeComposer fields to childTC
// these are the fields before calling discriminator

function copyBaseTCFieldsToChildTC(baseDTC, childTC) {
  const baseFields = baseDTC.getFieldNames();
  const childFields = childTC.getFieldNames();

  for (const field of baseFields) {
    const isFieldExists = childFields.find(fld => fld === field);

    if (isFieldExists) {
      childTC.extendField(field, {
        type: baseDTC.getField(field).type
      });
    } else {
      childTC.setField(field, baseDTC.getField(field));
    }
  }

  return childTC;
}

export function composeChildTC(baseDTC, childTC, opts) {
  const composedChildTC = copyBaseTCFieldsToChildTC(baseDTC, childTC);
  composedChildTC.addInterface(baseDTC.getDInterface());
  prepareChildResolvers(baseDTC, composedChildTC, opts);
  reorderFields(composedChildTC, opts.reorderFields, baseDTC.getDKey(), baseDTC.getFieldNames());
  return composedChildTC;
}