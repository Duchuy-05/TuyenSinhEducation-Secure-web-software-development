import React, { useState } from 'react';

const NEW_CATEGORY_OPTION = '__new__';

interface CategorySelectProps {
    value: string;
    categories: string[];
    onChange: (category: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, categories, onChange }) => {
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        if (selected === NEW_CATEGORY_OPTION) {
            setIsAddingNew(true);
            onChange('');
        } else {
            onChange(selected);
        }
    };

    if (isAddingNew) {
        return (
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Nhập tên danh mục mới"
                    autoFocus
                    className="flex-1 p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                    Hủy
                </button>
            </div>
        );
    }

    return (
        <select
            value={categories.includes(value) ? value : ''}
            onChange={handleSelectChange}
            className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-white"
        >
            <option value="" disabled>-- Chọn danh mục --</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value={NEW_CATEGORY_OPTION}>+ Thêm danh mục mới...</option>
        </select>
    );
};