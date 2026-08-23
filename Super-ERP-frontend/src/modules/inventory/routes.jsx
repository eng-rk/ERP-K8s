import { Route } from 'react-router-dom';
import InventoryDashboard from '../../pages/InventoryDashboard';
import InventoryItemsPage from '../../pages/InventoryItemsPage';
import InventoryItemDetail from '../../pages/InventoryItemDetail';
import StockOverviewPage from '../../pages/StockOverviewPage';
import TransactionsPage from '../../pages/TransactionsPage';
import ReceivingPage from '../../pages/ReceivingPage';
import ShippingPage from '../../pages/ShippingPage';
import TransfersPage from '../../pages/TransfersPage';
import AdjustmentsPage from '../../pages/AdjustmentsPage';
import CycleCountPage from '../../pages/CycleCountPage';
import PhysicalInventoryPage from '../../pages/PhysicalInventoryPage';
import WarehousesPage from '../../pages/WarehousesPage';
import PickTaskPage from '../../pages/PickTaskPage';
import InventoryReportsPage from '../../pages/InventoryReportsPage';
import SupplyChainPage from '../../pages/SupplyChainPage';

export const inventoryRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Receiving Clerk', 'Shipping Clerk', 'Warehouse Operator', 'Inventory Clerk', 'Quality Inspector'];
const receiveRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Receiving Clerk', 'Quality Inspector'];
const shippingRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Shipping Clerk', 'Warehouse Operator'];
const transferRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Warehouse Operator'];
const adjustmentRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Inventory Clerk'];
const countRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Warehouse Operator', 'Quality Inspector'];
const warehouseRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager'];
const pickRoles = ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Shipping Clerk', 'Warehouse Operator'];

export const inventoryRoutes = ({ ProtectedRoute, AppLayout }) => (<>
  <Route path="/inventory" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryDashboard /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/items" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryItemsPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/items/:id" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryItemDetail /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/stock" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><StockOverviewPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/transactions" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><TransactionsPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/receiving" element={<ProtectedRoute allowedRoles={receiveRoles}><AppLayout><ReceivingPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/shipping" element={<ProtectedRoute allowedRoles={shippingRoles}><AppLayout><ShippingPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/transfers" element={<ProtectedRoute allowedRoles={transferRoles}><AppLayout><TransfersPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/adjustments" element={<ProtectedRoute allowedRoles={adjustmentRoles}><AppLayout><AdjustmentsPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/cycle-counts" element={<ProtectedRoute allowedRoles={countRoles}><AppLayout><CycleCountPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/physical-inventories" element={<ProtectedRoute allowedRoles={transferRoles}><AppLayout><PhysicalInventoryPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/warehouses" element={<ProtectedRoute allowedRoles={warehouseRoles}><AppLayout><WarehousesPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/pick-tasks" element={<ProtectedRoute allowedRoles={pickRoles}><AppLayout><PickTaskPage /></AppLayout></ProtectedRoute>} />
  <Route path="/inventory/reports" element={<ProtectedRoute allowedRoles={adjustmentRoles}><AppLayout><InventoryReportsPage /></AppLayout></ProtectedRoute>} />
  <Route path="/supply-chain" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><SupplyChainPage /></AppLayout></ProtectedRoute>} />
  <Route path="/supply-chain/:section" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><SupplyChainPage /></AppLayout></ProtectedRoute>} />
</>);
