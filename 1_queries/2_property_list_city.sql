SELECT p.id, p.title, p.cost_per_night, AVG(pr.rating) AS average_rating
FROM properties p
JOIN property_reviews pr ON p.id = pr.property_id
WHERE p.city = 'Vancouver' AND pr.rating >= 4
GROUP BY p.id
ORDER BY p.cost_per_night
LIMIT 10;
