import { Request } from 'express';
import * as functions from 'firebase-functions';
import { db } from '../config/firebase';
import axios from 'axios';

export const getIp = (req: Request, collection: string, status: any) => {
  const { surveyId } = req.params;
  const IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (IP) {
    axios
      .get(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=e28855b523284c2589f6c61bd0225ebf&ip_address=${IP}&fields=ip_address,city,city_geoname_id,region,region_iso_code,postal_code,country,country_code,country_geoname_id,continent,longitude,latitude,security,timezone,connection`,
      )
      .then((response) => {
        db.collection('surveys')
          .doc(surveyId)
          .collection(collection)
          .add({ ...response?.data, status, date: new Date().toISOString() });
      })
      .catch((error) => {
        functions.logger.error('GET IP GEOLOCATION', error);
        db.collection('surveys').doc(surveyId).collection(collection).add({
          status,
          ip: 'API_ERROR',
          date: new Date().toISOString(),
        });
      });
  } else {
    functions.logger.info('IP NOT_FOUND');

    db.collection('surveys').doc(surveyId).collection(collection).add({
      status,
      ip: 'NOT_FOUND',
      date: new Date().toISOString(),
    });
  }
};
