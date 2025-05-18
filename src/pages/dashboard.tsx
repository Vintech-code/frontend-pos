import Breadcrumb from "../components/breadcrumbs";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";


// Example data for the metrics, you can replace these with dynamic data
const metrics = {
  totalSales: 2000, // Placeholder value
  totalProducts: 50, // Placeholder value
  totalCustomers: 120, // Placeholder value
  totalOrders: 75, // Placeholder value
};

function Dashboard() {
  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content">
        <div className="container-fluid">
          <Breadcrumb title="Dashboard" links={[{ text: "Home", link: "/" }]} active="Dashboard" />

          <div className="grid grid-cols-3 gap-x-9">
           

            {/* Dashboard Metrics */}
            <div className="xxl:col-span-9 col-span-12">
              <div className="grid grid-cols-4 gap-4">
                {/* Total Sales */}
                <div className="col-span-1">
                  <div className="box overflow-hidden main-content-card">
                    <div className="box-body p-5 text-center">
                      <h3>Total Sales</h3>
                      <p className="text-xl font-semibold">₱{metrics.totalSales}</p>
                    </div>
                  </div>
                </div>

                {/* Total Products */}
                <div className="col-span-1">
                  <div className="box overflow-hidden main-content-card">
                    <div className="box-body p-5 text-center">
                      <h3>Total Products</h3>
                      <p className="text-xl font-semibold">{metrics.totalProducts}</p>
                    </div>
                  </div>
                </div>

                {/* Total Customers */}
                <div className="col-span-1">
                  <div className="box overflow-hidden main-content-card">
                    <div className="box-body p-5 text-center">
                      <h3>Total Customers</h3>
                      <p className="text-xl font-semibold">{metrics.totalCustomers}</p>
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="col-span-1">
                  <div className="box overflow-hidden main-content-card">
                    <div className="box-body p-5 text-center">
                      <h3>Total Orders</h3>
                      <p className="text-xl font-semibold">{metrics.totalOrders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Shop Section */}
            <div className="col-span-4">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5 text-center">
                  <h3>Shop</h3>
                  <p>Browse and manage products</p>
                  <a href="/shop" className="btn btn-primary">Go to Shop</a>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="col-span-4">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5 text-center">
                  <h3>Orders</h3>
                  <p>View and manage orders</p>
                  <a href="/orders" className="btn btn-primary">View Orders</a>
                </div>
              </div>
            </div>

            {/* Inventory Section */}
            <div className="col-span-4">
              <div className="box overflow-hidden main-content-card">
                <div className="box-body p-5 text-center">
                  <h3>Inventory</h3>
                  <p>Manage your inventory stock</p>
                  <a href="/inventory" className="btn btn-primary">Go to Inventory</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
