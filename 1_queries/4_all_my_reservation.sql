SELECT 
    reservations.id, properties.title, properties.cost_per_night, reservations.start_date, 
    AVG(pr.rating) AS average_rating
FROM reservations 
JOIN properties  ON reservations.property_id = properties.id
LEFT JOIN property_reviews pr ON properties.id = pr.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date
ORDER BY reservations.start_date
LIMIT 10;
