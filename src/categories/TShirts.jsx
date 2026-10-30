import CategoryPageLayout from "./CategoryPageLayout.jsx";

export default function TShirts({ onShopAll }) {
  return <CategoryPageLayout title="T-shirts" description="Everyday tees, made with comfortable cotton and easy-to-wear fits." image="https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=85" onShopAll={onShopAll} />;
}
