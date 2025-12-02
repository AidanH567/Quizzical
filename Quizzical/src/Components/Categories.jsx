import { useEffect, useState } from "react";

export default function CategorySelect({ value, onChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function loadCategories() {
            const res = await fetch("https://opentdb.com/api_category.php");
            const data = await res.json();
            setCategories(data.trivia_categories);
        }

        loadCategories();
    }, []);

    return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Any Category</option>

            {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
            ))}
        </select>
    );
}