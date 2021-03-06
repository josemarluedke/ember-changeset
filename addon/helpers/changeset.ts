import { helper } from '@ember/component/helper';
import Changeset from 'ember-changeset';
import { Config } from 'ember-changeset/types/config';
import { ValidatorAction, ValidatorMap } from 'ember-changeset/types/validator-action';
import lookupValidator from 'ember-changeset/utils/validator-lookup';
import isChangeset from 'ember-changeset/utils/is-changeset';
import isPromise from 'ember-changeset/utils/is-promise';
import isObject from 'ember-changeset/utils/is-object';

export function changeset(
  [obj, validations]: [object | Promise<any>, ValidatorAction | ValidatorMap],
  options: Config = {}
): Changeset | Promise<Changeset> {
  if (isChangeset(obj)) {
    return obj;
  }

  if (isObject(validations)) {
    if (isPromise(obj)) {
      return (<Promise<any>>obj).then((resolved) =>
        new Changeset(resolved, lookupValidator(<ValidatorMap>validations), <ValidatorMap>validations, options)
      );
    }

    return new Changeset(obj, lookupValidator(<ValidatorMap>validations), <ValidatorMap>validations, options);
  }

  if (isPromise(obj)) {
    return Promise.resolve(obj).then((resolved: any) => new Changeset(resolved, <ValidatorAction>validations, {}, options));
  }

  return new Changeset(obj, <ValidatorAction>validations, {}, options);
}

export default helper(changeset);
