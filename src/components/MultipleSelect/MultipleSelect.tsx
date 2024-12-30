import { upsrtcCitiesAndTowns } from "@/data/via";
import React, { useEffect, useRef, useState } from "react";

interface MultipleSelectProps {
    formData: {
        from: string;
        to: string;
        busNumber: string;
        via: string[]
        location: {
            lat: number;
            lng: number;
        };
    };

    setFormData: React.Dispatch<React.SetStateAction<{
        from: string;
        to: string;
        busNumber: string;
        via: string[]
        location: {
            lat: number;
            lng: number;
        };
    }>>;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({ formData, setFormData }) => {
    const [via, setvia] = useState<string[]>([]);
    const [expertiseOptions] = useState(upsrtcCitiesAndTowns);
    const [search, setSearch] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Add selected option to the list
    const handleSelect = (option: string) => {
        if (!via.includes(option)) {
            setvia((prev) => [...prev, option]);
        }
        setSearch("");
        setDropdownVisible(false);
    };

    // Add a custom option
    const handleCustomExpertise = () => {
        const trimmed = search.trim();
        if (trimmed && !via.includes(trimmed)) {
            setvia((prev) => [...prev, trimmed]);
        }
        setSearch("");
        setDropdownVisible(false);
    };

    // Remove selected option
    const handleRemove = (option: string) => {
        setvia((prev) => prev.filter((item) => item !== option));
    };

    // Filter dropdown options
    const filteredOptions = expertiseOptions.filter(
        (option) =>
            option.toLowerCase().includes(search.toLowerCase()) &&
            !via.includes(option)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setTimeout(() => {
                setDropdownVisible(false);
            }, 250);
        };
        document.addEventListener("mousedown", handleClickOutside);

        if (via || formData) {
            setFormData({ ...formData, via: via })
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, [via]);

    return (
        <div className="relative w-full max-w-md mb-2">
            <label className="block text-sm font-light text-gray-400  mb-2">
                Via
            </label>
            <div
                className="w-full bg-gray-700 rounded-md p-2 focus-within:ring-1 focus-within:ring-blue-500"
                ref={dropdownRef}
            >
                {/* Display selected items */}
                <div className="flex flex-wrap min-h-6 max-h-20 overflow-y-scroll gap-2 mb-2">
                    {via.map((option) => (
                        <span
                            key={option}
                            className="flex items-center px-2 py-1 bg-gray-500 text-gray-50 text-sm rounded-md"
                        >
                            {option}
                            <button
                                type="button"
                                onClick={() => handleRemove(option)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                {/* Input for searching/adding */}
                <input
                    type="text"
                    placeholder="Search and select..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setDropdownVisible(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleCustomExpertise();
                        }
                    }}
                    className="w-full bg-gray-600 py-1 px-4 border-b border-gray-300 rounded-t-xl outline-none text-sm"
                />
            </div>
            {/* Dropdown menu */}
            {dropdownVisible && (
                <div className="absolute bg-gray-500 border border-gray-700 rounded-md shadow-lg mt-1 max-h-40 overflow-auto z-10 w-full">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="px-3 py-1 font-light text-gray-100 hover:bg-gray-800 cursor-pointer"
                            >
                                {option}
                            </div>
                        ))
                    ) : search.trim() ? (
                        <div
                            onClick={handleCustomExpertise}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                            Add "{search}"
                        </div>
                    ) : (
                        <div className="px-3 py-2 text-gray-100">No options available</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultipleSelect;