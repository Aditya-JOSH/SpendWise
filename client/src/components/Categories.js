import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/api/v1/categories")
      .then(res => {
        setCategories(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load categories');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1>Categories</h1>
      {categories.map(({ id, attributes }) => (
        <p key={id}>{attributes.name}</p>
      ))}
    </div>
  );
}

export default Categories;
