import CategoryPageLayout from "./CategoryPageLayout.jsx";

export default function Shirts({ onShopAll }) {
  return <CategoryPageLayout title="Shirts" description="Button-ups and relaxed shirts for plans, workdays, and everything between." image="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85" onShopAll={onShopAll} />;
}
