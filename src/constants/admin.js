/**
 * Error constants for the Admin.
 */
const Common = {
  'INTERNAL_SERVER_ERR': 'Internal Server Error',
  'IMAGE_UPD_ERR': 'Error while uploading image.'
};

const Auth = {
  'UNAUTHORIZED': 'Unauthorized',
  'FAILED_TO_LOGOUT': 'Failed to logout',
  'EMAIL_VERIFICATION_FAILED': 'Link is invalid or expired. Please try again.',
};

const Org_Auth = {
  'BAD_REQUEST': 'Bad request',
  'DUPLICATE_NAME': 'Name must be unique',
  'INVALID_CREDENTIAL': 'Invalid credential',
  'INVALID_CONFIGURATION': 'Invalid configuration',
  'INVALID_AUTH_URL': 'Invalid authentication url',
  'INVALID_CLIENT': 'Client authentication failed. Make sure that the client ID and client secret are valid.',
};

const Admin = {
  'EMAIL_NOT_EXISTS': "Admin with given email doesn't exist",
  'INCORRECT_PASS': 'Incorrect password',
  'SUCC_LOGIN': 'User successfully logged in',
  'LINK_INVALID': 'Invalid Link',
  'USER_NOT_FOUND': 'User not found',
  'EMAIL_ALREADY_EXIST': 'Another user with the same email id exists.',
  'LINK_EXPIRE': 'Invalid link or expired',
  'PASSWORD_SENT_ON_EMAIL': 'Password reset link sent to your email account',
  'PASS_SUCC_RESET': 'Password reset successfully.'
};

const Activity_Logs = {
  USER: 'User',
  USER_CHANGE_STATUS: 'User status Changes',
  CATE: 'Category',
  CATE_CREATE: 'New category created',
  CATE_UPDATE: 'Category updated',
  CATE_DELETE: 'Category deleted',
  PROD: 'Product',
  PROD_CREATE: 'New product created',
  PROD_UPDATE: 'Product updated',
  PROD_DELETE: 'Product deleted',
  PROD_IMG_DELETE: 'Product image deleted',
  ADMIN: 'Admin',
  ADMIN_CREATE: 'New Admin created',
  ADMIN_UPDATE: 'Admin updated',
  ADMIN_CHANGE_STATUS: 'Admin status Changes',
  PRODTAG: 'Product Tag',
  PROD_TAG_CREATE: 'New product tag created',
  PROD_TAG_UPDATE: 'Product tag updated',
  PROD_TAG_DELETE: 'Product tag deleted',
  ATTRIBUTE: 'Attribute',
  ATTRIBUTE_CREATE: 'New Attribute created',
  ATTRIBUTE_UPDATE: 'New Attribute updated',
  ATTRIBUTE_AND_VAL_CREATE: 'New Attribute created',
  ATTRIBUTE_AND_VAL_UPDATE: 'New Attribute updated',
  ATTRIBUTE_AND_VAL_DELETE: 'New Attribute deleted',
  ATTRIBUTE_VALUE: 'Attribute Value',
  ATTRIBUTE_AND_VAL_CREATE: 'New Attribute Value created',
  ATTRIBUTE_AND_VAL_UPDATE: 'New Attribute Value updated',
  ATTRIBUTE_AND_VAL_DELETE: 'New Attribute Value deleted',
  BRAND: 'Brand',
  BRAND_CREATE: 'New Brand created',
  BRAND_UPDATE: 'New Brand updated',
  BRAND_DELETE: 'New Brand deleted',
  MODULE: 'Module',
  MODULE_CREATE: 'New Module created',
  MODULE_UPDATE: 'New Module updated',
  MODULE_DELETE: 'New Module deleted',
  UNIT: 'Unit',
  UNIT_CREATE: 'New Unit created',
  UNIT_UPDATE: 'New Unit updated',
  UNIT_DELETE: 'New Unit deleted',
  USER_ADDRESS: 'User Address',
  USER_ADDRESS_CREATE: 'New User Address created',
  USER_ADDRESS_UPDATE: 'New User Address updated',
  USER_ADDRESS_DELETE: 'New User Address deleted',
  INVENTORY_GEONAME: 'Inventory Geoname',
  INVENTORY_GEONAME_CREATE: 'New Brand created',
  INVENTORY_GEONAME_UPDATE: 'New Brand updated',
  INVENTORY_GEONAME_DELETE: 'New Brand deleted',
  SUPPLIER: 'Supplier',
  SUPPLIER_CREATE: 'New Supplier created',
  SUPPLIER_UPDATE: 'New Supplier updated',
  SUPPLIER_DELETE: 'New Supplier deleted',
  INVENTORY: 'Inventory',
  INVENTORY_CREATE: 'New Inventory created',
  INVENTORY_UPDATE: 'New Inventory updated',
  INVENTORY_DELETE: 'New Inventory deleted',
  DELIVERY_ADDRESS: 'Delivery Address',
  DELIVERY_ADDRESS_CREATE: 'New Delivery Address created',
  DELIVERY_ADDRESS_UPDATE: 'New Delivery Address updated',
  DELIVERY_ADDRESS_DELETE: 'New Delivery Address deleted',
  DELIVERY_ROUTE: 'Delivery Route',
  DELIVERY_ROUTE_CREATE: 'New Delivery Route created',
  DELIVERY_ROUTE_UPDATE: 'New Delivery Route updated',
  DELIVERY_ROUTE_DELETE: 'New Delivery Route deleted',
  COUPON_MASTER: 'Coupon Master',
  COUPON_MASTER_CREATE: 'New Coupon Master created',
  COUPON_MASTER_UPDATE: 'New Coupon Master updated',
  COUPON_MASTER_DELETE: 'New Coupon Master deleted',
  ORDER_DELIVERY_AGENT: 'Order Delivery  Agent ',
  ORDER_DELIVERY_AGENT_CREATE: 'New Order Delivery  Agent created',
  ORDER_DELIVERY_AGENT_UPDATE: 'New Order Delivery  Agent updated',
  ORDER_DELIVERY_AGENT_DELETE: 'New Order Delivery  Agent deleted',
  DELIVERY_AGENT: 'Delivery  Agent ',
  DELIVERY_AGENT_CREATE: 'New Delivery  Agent created',
  DELIVERY_AGENT_UPDATE: 'New Delivery  Agent updated',
  DELIVERY_AGENT_DELETE: 'New Delivery  Agent deleted',
  SYSTEM_SETTING: 'SYSTEM SETTING',
  SYSTEM_SETTING_CREATE: 'New Setting created',
  PAYMENT_HISTORY: 'PAYMENT HISTORY',
  PAYMENT_HISTORY_CREATE: 'New History created',
}

const Order = {
  PROD_NO_LONGER_AVAIL: 'Product no longer available. Please add another product!',
  SHIPPING_CHARGE: 50.00
}

const Order_type = {
  ADMIN_CREATED: 'ADMIN_CREATED',
  USER_CREATED: 'USER_CREATED',
}

const Order_Status = {
  CREATED: 'ORDER_CREATED',
  CREATED_DES: 'Order created successfully.',
  ACCEPTED: 'ORDER_ACCEPTED',
  ACCEPTED_DES: 'Order accepted by the seller.',
  CANCELLED_BY_SELLER: 'CANCELLED_BY_SELLER',
  CANCELLED_BY_SELLER_DES: 'Order canceled by the seller.',
  CANCELLED_BY_USER: 'CANCELLED_BY_USER',
  CANCELLED_BY_USER_DES: 'Order canceled by the customer.',
  SHIPPED: 'ORDER_SHIPPED',
  SHIPPED_DES: 'Order shipped by seller.',
  DELIVERED: 'ORDER_DELIVERED',
  DELIVERED_DES: 'Order delivered to the customer.',
  RETURNED: 'ORDER_RETURNED',
  RETURNED_DES: 'Order returned by the customer.',
  PARTIALLY_RETURNED: 'ORDER_PARTIALLY_RETURNED',
  PARTIALLY_RETURNED_DES: 'Order partially returned by the customer.',
  FULL_REFUND: 'ORDER_FULL_REFUND',
  FULL_REFUND_DES: 'Order fully refunded to the customer.',
  PARTIAL_REFUND: 'ORDER_PARTIAL_REFUND',
  PARTIAL_REFUND_DES: 'Order partially refunded to the customer.',
  SUBSCRIPTION_STARTED: 'SUBSCRIPTION_STARTED',
  SUBSCRIPTION_STARTED_DES: 'Order subscription started.',
  SUBSCRIPTION_COMPLETED: 'SUBSCRIPTION_COMPLETED',
  SUBSCRIPTION_COMPLETED_DES: 'Order subscription completed.'
}

const Order_Payment_Status = {
  CANCELLED: 'CANCELLED',
  COD: 'CASH ON DELIVERY',
  DECLINED: 'DECLINED',
  DISPUTED: 'DISPUTED',
  INTERNAL: 'INTERNALLY MANAGED',
  PAID: 'PAID',
  PARTIAL_REFUND: 'PARTIALLY REFUNDED',
  PENDING: 'PENDING',
  REFUND_INIT: 'REFUND INITIALIZED',
  REFUNDED: 'REFUND COMPLETED',
  SUBSCRIPTION: 'SUBSCRIPTION BASED PAYMENT'
}

const Order_Shipping_Method = {
  STANDARD_DELIVERY: 'STANDARD DELIVERY'
}

const Unique_Fields = [
  'CATEGORY_NAME',
  'LANGUAGE_CODE',
  'ADMIN_EMAIL',
  'USER_EMAIL',
  'USER_PHONE',
  'CONFIGURATION_VARIABLE_NAME',
  'INVENTORY_GEONAME_ZIP_CODE',
  'UNIT_SLUG'
]

module.exports = {
  Common,
  Auth,
  Admin,
  Org_Auth,
  Activity_Logs,
  Order,
  Order_type,
  Order_Status,
  Order_Payment_Status,
  Order_Shipping_Method,
  Unique_Fields
};
