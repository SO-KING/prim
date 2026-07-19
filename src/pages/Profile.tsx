import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Package, CreditCard, Bell, Shield, Truck, Plus, X, ChevronRight, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAuth } from '../App';
import AnimatedSection from '../components/AnimatedSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

type Tab = 'account' | 'shipping' | 'notifications' | 'security';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([
    { id: 1, label: 'Home', street: '123 Main Street', city: 'Cairo', country: 'Egypt', phone: '+20 100 123 4567', default: true },
    { id: 2, label: 'Work', street: '456 Business Ave', city: 'Alexandria', country: 'Egypt', phone: '+20 100 987 6543', default: false },
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', country: 'Egypt', phone: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.updateProfile({ name, phone, address });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city) {
      toast.error('Please fill all required fields');
      return;
    }
    setShippingAddresses([...shippingAddresses, { ...newAddress, id: Date.now(), default: shippingAddresses.length === 0 }]);
    setNewAddress({ label: '', street: '', city: '', country: 'Egypt', phone: '' });
    setShowAddAddress(false);
    toast.success('Address added!');
  };

  const removeAddress = (id: number) => {
    setShippingAddresses(shippingAddresses.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  const setDefaultAddress = (id: number) => {
    setShippingAddresses(shippingAddresses.map(a => ({ ...a, default: a.id === id })));
    toast.success('Default address updated');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedSection>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Account</h1>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <AnimatedSection direction="left" className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-28">
            {/* User Card */}
            <div className="p-6 text-center border-b border-slate-200 dark:border-slate-700">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3 shadow-lg">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 mt-2 capitalize">
                {user?.role}
              </span>
            </div>

            {/* Tabs */}
            <div className="p-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => { logout(); }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <AnimatedSection>
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" /> Account Settings
                </h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="email" value={user?.email || ''} disabled
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm opacity-60 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all"
                          placeholder="+20 123 456 7890" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all"
                          placeholder="Your address" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={saving}
                    className="inline-flex items-center px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 transition-all duration-200 shadow-lg active:scale-95">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </AnimatedSection>
          )}

          {/* Shipping Addresses */}
          {activeTab === 'shipping' && (
            <AnimatedSection>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Truck className="h-5 w-5 mr-2" /> Shipping Addresses
                  </h2>
                  <button onClick={() => setShowAddAddress(!showAddAddress)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-md active:scale-95">
                    <Plus className="h-4 w-4 mr-1" /> Add Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <div className="mb-6 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input value={newAddress.label} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                        placeholder="Label (Home, Work...)" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                      <input value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        placeholder="Phone" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                      <input value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        placeholder="Street address" className="md:col-span-2 w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                      <input value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                      <input value={newAddress.country} onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        placeholder="Country" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={addAddress} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-sm active:scale-95">
                        Save Address
                      </button>
                      <button onClick={() => setShowAddAddress(false)} className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                <div className="space-y-3">
                  {shippingAddresses.map((addr) => (
                    <div key={addr.id} className={`p-5 rounded-xl border transition-all duration-200 ${
                      addr.default
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-700/50'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            addr.default ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-900 dark:text-white">{addr.label}</span>
                              {addr.default && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 uppercase tracking-wider">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{addr.street}</p>
                            <p className="text-sm text-slate-500">{addr.city}, {addr.country}</p>
                            <p className="text-sm text-slate-500">{addr.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!addr.default && (
                            <button onClick={() => setDefaultAddress(addr.id)}
                              className="p-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                              Set Default
                            </button>
                          )}
                          <button onClick={() => removeAddress(addr.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <AnimatedSection>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Bell className="h-5 w-5 mr-2" /> Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                    { title: 'Order Updates', desc: 'Get notified when your order status changes', enabled: true },
                    { title: 'Promotions & Deals', desc: 'Receive special offers and discounts', enabled: true },
                    { title: 'Product Recommendations', desc: 'Get personalized product suggestions', enabled: false },
                    { title: 'Newsletter', desc: 'Weekly newsletter with latest updates', enabled: true },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-checked:bg-slate-900 dark:peer-checked:bg-white peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <AnimatedSection>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                  <Shield className="h-5 w-5 mr-2" /> Security
                </h2>

                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Password</h3>
                    <p className="text-sm text-slate-500 mb-4">Change your password regularly to keep your account secure.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input type="password" placeholder="Current password" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                      <input type="password" placeholder="New password" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-slate-900 outline-none" />
                    </div>
                    <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-sm active:scale-95">
                      Update Password
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                    <button className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm">
                      Enable 2FA
                    </button>
                  </div>

                  <div className="p-5 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                    <h3 className="font-medium text-red-700 dark:text-red-400 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-500 mb-4">Permanently delete your account and all data.</p>
                    <button className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all text-sm active:scale-95">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/orders" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">My Orders</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/cart" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Shopping Cart</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">Browse Products</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
