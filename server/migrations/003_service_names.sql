-- Migration 003: rename Driveway Cleaning, add RV and Fleet Washing

UPDATE jobs
  SET service_type = 'Concrete / Driveway Cleaning'
  WHERE service_type = 'Driveway Cleaning';

UPDATE business_services
  SET service_type = 'Concrete / Driveway Cleaning'
  WHERE service_type = 'Driveway Cleaning';
