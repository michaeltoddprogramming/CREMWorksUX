import { useState, useRef, useEffect } from "react";
import styles from "./AdminPortal.module.css";

function BrandDropdown({ brands, selectedBrand, setSelectedBrand }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearch(""); // reset search when closing
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBrands = brands.filter(b =>
    b.toLowerCase().includes(search.toLowerCase())
  );

  return (
 <div className={styles.brandDropdown} ref={dropdownRef}>
  <div className={styles.inputWrapper}>
    {open ? (
      <input
        type="text"
        autoFocus
        placeholder="Type to search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.dropdownSearch}
      />
    ) : (
      <button
        className={styles.dropdownToggle}
        onClick={() => setOpen(true)}
      >
        {selectedBrand || "Select a brand"}
      </button>
    )}
  </div>

  {open && (
    <ul className={styles.dropdownList}>
        <li onClick={() => setSelectedBrand(null)}>
            All Brands
        </li>
      {filteredBrands.map((brand, index) => (
        <li
          key={index}
          onClick={() => {
            setSelectedBrand(brand);
            setOpen(false);
            setSearch("");
          }}
        >
          {brand}
        </li>
      ))}
      {filteredBrands.length === 0 && <li>No brands found</li>}
    </ul>
  )}
</div>

  );
}

export default BrandDropdown;
