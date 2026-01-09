import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BrandCard from "../components/BrandCard";

import appleLogo from "../assets/brands/apple.svg";
import samsungLogo from "../assets/brands/samsung.svg";
import googleLogo from "../assets/brands/google.svg";
import oneplusLogo from "../assets/brands/oneplus.svg";
import xiaomiLogo from "../assets/brands/xiaomi.svg";
import oppoLogo from "../assets/brands/oppo.svg";
import motorolaLogo from "../assets/brands/motorola.svg";
import nokiaLogo from "../assets/brands/nokia.svg";
import sonyLogo from "../assets/brands/sony.svg";
import vivoLogo from "../assets/brands/vivo.svg";

const popularBrands = [
  { name: "Apple", logoSrc: appleLogo, logoAlt: "Apple logo" },
  { name: "Samsung", logoSrc: samsungLogo, logoAlt: "Samsung logo" },
  { name: "Google", logoSrc: googleLogo, logoAlt: "Google logo" },
  { name: "OnePlus", logoSrc: oneplusLogo, logoAlt: "OnePlus logo" },
  { name: "Xiaomi", logoSrc: xiaomiLogo, logoAlt: "Xiaomi logo" },
  { name: "Oppo", logoSrc: oppoLogo, logoAlt: "Oppo logo" },
  { name: "Motorola", logoSrc: motorolaLogo, logoAlt: "Motorola logo" },
  { name: "Nokia", logoSrc: nokiaLogo, logoAlt: "Nokia logo" },
  { name: "Sony", logoSrc: sonyLogo, logoAlt: "Sony logo" },
  { name: "Vivo", logoSrc: vivoLogo, logoAlt: "Vivo logo" }
];

const normalizeSlug = (value) => String(value || "").trim().toLowerCase();

const titleCaseFromSlug = (slug) => {
  const s = String(slug || "").trim();
  if (!s) return "";
  return s
    .split("-")
    .filter(Boolean)
    .map((p) => p.slice(0, 1).toUpperCase() + p.slice(1))
    .join(" ");
};

const CATEGORY_META = {
  spareParts: {
    id: "spareParts",
    label: "Spare Parts",
    description: "Select your brand to view compatible spare parts and options."
  },
  accessories: {
    id: "accessories",
    label: "Accessories",
    description: "Select your brand to browse compatible accessories."
  }
};

// PUBLIC_INTERFACE
export default function SpareAccessoryItem() {
  /** Item page for Spare Parts / Accessories flow: shows item title and a brand grid. */
  const { category, itemSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const categoryKey = useMemo(() => {
    const c = normalizeSlug(category);
    if (c === "spare-parts" || c === "spareparts") return "spareParts";
    if (c === "accessories" || c === "accessory") return "accessories";
    return "";
  }, [category]);

  const categoryMeta = categoryKey ? CATEGORY_META[categoryKey] : null;

  const itemTitle = useMemo(() => titleCaseFromSlug(itemSlug), [itemSlug]);

  const selection = useMemo(() => {
    const stateCategory = location.state?.selectedCategoryId
      ? String(location.state.selectedCategoryId)
      : "";
    const stateCategoryLabel = location.state?.selectedCategoryLabel
      ? String(location.state.selectedCategoryLabel)
      : "";

    // Preserve category state if navigated from Home; otherwise fall back to URL.
    const selectedCategoryId = stateCategory || categoryKey || "";
    const selectedCategoryLabel =
      stateCategoryLabel || categoryMeta?.label || (selectedCategoryId ? titleCaseFromSlug(selectedCategoryId) : "");

    return { selectedCategoryId, selectedCategoryLabel };
  }, [location.state, categoryKey, categoryMeta]);

  if (!categoryMeta || !itemTitle) {
    return (
      <main className="section">
        <div className="container">
          <div className="empty">
            <div className="empty__title">Page not found</div>
            <div className="empty__text">This item page is not available.</div>
            <div style={{ marginTop: 16 }}>
              <Link to="/" className="btn btn--soft">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <div>
            <div className="pill pill--soft">{selection.selectedCategoryLabel}</div>
            <h1 className="h1" style={{ marginTop: 10 }}>
              {itemTitle}
            </h1>
            <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
              {categoryMeta.description}
            </p>
          </div>

          <div className="pageHeader__actions">
            <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
              Go back
            </button>
            <Link to="/" className="btn btn--soft">
              Home
            </Link>
          </div>
        </div>

        <section aria-label="Select your brand" style={{ paddingTop: 6 }}>
          <div className="sectionHeader" style={{ marginBottom: 14 }}>
            <div>
              <h2 className="h2">Choose your brand</h2>
              <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
                Your selection will carry forward to browse services.
              </p>
            </div>
          </div>

          <div className="brandBigGrid" role="list" aria-label="Popular brands">
            {popularBrands.map((b) => (
              <div role="listitem" key={b.name}>
                <BrandCard name={b.name} logoSrc={b.logoSrc} logoAlt={b.logoAlt} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
