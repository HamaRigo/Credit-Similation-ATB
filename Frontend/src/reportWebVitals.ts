import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (typeof onPerfEntry === 'function') {
    import('web-vitals')
        .then((webVitals) => {
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
          [getCLS, getFID, getFCP, getLCP, getTTFB].forEach((metric) => {
            metric(onPerfEntry);
          });
        })
        .catch((error) => {
          console.error('Error loading web-vitals:', error);
        });
  }
};

export default reportWebVitals;