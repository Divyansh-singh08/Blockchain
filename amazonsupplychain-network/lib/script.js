/**
* Initiate PO from one trader to another
* @param {org.amazonsupplychain.network.InitiatePO} InitiatePO - the InitiatePO is to be processed
* @transaction
*/
function initiatePurchaseOrder(InitiatePO) 
{
console.log('Start of InitiatePO Function');
  
var factory = getFactory();
var NS = 'org.amazonsupplychain.network';
var me = getCurrentParticipant();
  
var order = factory.newResource(NS, 'PO', InitiatePO.orderId);

order.itemList = InitiatePO.itemList;
  
if (InitiatePO.orderTotalPrice) 
{
order.orderTotalPrice = InitiatePO.orderTotalPrice;
}
order.orderStatus = 'INITIATED';
order.orderer = me;
order.vendor = InitiatePO.vendor;
  
return getAssetRegistry(order.getFullyQualifiedType()).then(function (assetRegistry){
return assetRegistry.add(order);
});
  
}

/**
* Track the trade of a commodity from one trader to another
* @param {org.amazonsupplychain.network.TransferCommodity} trade - the InitiatePO is to be processed
* @transaction
*/

function transferCommodity(trade) 
{
console.log('Start function transfer Commodity');
var NS = 'org.amazonsupplychain.network';
var me = getCurrentParticipant();
var factory = getFactory();
  
trade.commodity.issuer = me;
trade.commodity.owner = trade.newOwner;
trade.commodity.purchaseOrder = trade.purchaseOrder;
  
var newTrace = factory.newConcept(NS, 'Trace');
newTrace.timestamp = new Date();
newTrace.location = trade.shipperLocation;
newTrace.company = me;
trade.commodity.trace.push(newTrace);
  
return getAssetRegistry('org.amazonsupplychain.network.Commodity').then(function (assetRegistry) {
return assetRegistry.update(trade.commodity);
});
}
