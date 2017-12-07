import Country from '../models/country.model';
import Ethnicity from '../models/ethnicity.model';
import User from '../models/user.model';

export function ethnicityExists(data: any, field: string, message: string, args: any[], get: Function) {
  return new Promise((resolve, reject) => {
    // obtain field value
    const fieldValue = get(data, field);
    if (!fieldValue) return resolve('validation skipped');

    Ethnicity.findById<Ethnicity>(fieldValue)
      .then(eth => (eth ? resolve('validation passed') : reject(`Field ${field} is not a valid value.`)))
      .catch(e => reject(e.message));
  });
}

export function countryExists(data: any, field: string, message: string, args: any[], get: Function) {
  return new Promise((resolve, reject) => {
    // obtain field value
    const fieldValue = get(data, field);
    if (!fieldValue) return resolve('validation skipped');

    Country.findByPrimary<Country>(fieldValue)
      .then(
        c => (c ? resolve('validation passed') : reject(`Field ${field} with value (${fieldValue}) does not exists.`))
      )
      .catch(e => reject(e.message));
  });
}

export function uniqueEmail(data: any, field: string, message: string, args: any[], get: Function) {
  return new Promise((resolve, reject) => {
    // obtain field value
    const email = get(data, field);
    if (!email) return resolve('validation skipped');

    User.find<User>({ where: { email } })
      .then(u => (u ? reject(`Field ${field} with value (${email}) already exists.`) : resolve('validation passed')))
      .catch(e => reject(e.message));
  });
}
