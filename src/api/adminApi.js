import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const adminHeaders = {
  'x-admin-email': ADMIN_EMAIL,
  'x-admin-password': ADMIN_PASSWORD,
};
// vendors apis
export const getVendors = () => axios.get(`${BASE_URL}/Admin/vendors`, { headers: adminHeaders }); //done
export const approveVendor = (phoneNumber) => axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/approve`, {}, { headers: adminHeaders });//done
export const disapproveVendor = (phoneNumber) => axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/disapprove`, {}, { headers: adminHeaders }); //done
export const disableVendor = (phoneNumber) => axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/disable`, {}, { headers: adminHeaders }); //done
export const enableVendor = (phoneNumber) => axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/enable`, {}, { headers: adminHeaders }) //done
export const approveProduct = (productId) => axios.put(`${BASE_URL}/Admin/products/${productId}/accept`, {}, { headers: adminHeaders }); //done.
export const rejectProduct = (productId) =>axios.put(`${BASE_URL}/Admin/products/${productId}/reject`, {}, { headers: adminHeaders }); //will be edited after sometime.
export const deleteProduct = (productId) => axios.delete(`${BASE_URL}/Vendor/deleteproduct/${productId}`); // done
export const autoApproveProducts = (phoneNumber)=> axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/auto-approve-products`, { autoApprove: true }, { headers: adminHeaders }); //done
export const autoDisApproveProducts = (phoneNumber)=> axios.put(`${BASE_URL}/Admin/vendors/${phoneNumber}/auto-approve-products`, { autoApprove: false }, { headers: adminHeaders }); //done
export const getProducts = () => axios.get(`${BASE_URL}/Customer/products`, { headers: adminHeaders }); //done


//products apis
export const getPendingProducts = () => axios.get(`${BASE_URL}/Admin/products/pending`, { headers: adminHeaders });



