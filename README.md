# External pricing widget for [Oracle Commerce Cloud](https://cloud.oracle.com/en_US/commerce-cloud "Oracle Commerce Cloud")

Interface and modules to help implement [external pricing](https://docs.oracle.com/cd/E97801_01/Cloud.18C/ExtendingCC/html/s2201integratewithanexternalpricingsy01.html "External Pricing") in [Oracle Commerce Cloud](https://cloud.oracle.com/en_US/commerce-cloud "Oracle Commerce Cloud")
This widget akes a prepricing call to an external system which then will return the new price and then apply it to the cart model.

- [External Pricing ](https://docs.oracle.com/cd/E97801_01/Cloud.18C/ExtendingCC/html/s2201integratewithanexternalpricingsy01.html "External Pricing in Oracle Commerce Cloud")
  - Add products to your catalogue to trigger the "prepricing" event in the OCCS subsystem.
  - For a working example with this widget, install the [occ-sse-webhook-stubs](https://github.com/leedium/occ-sse-webhook-stubs) Server-Side Extension(SSE), and as mentioned above add the following products  defined in the test [JSON](https://github.com/leedium/occ-sse-webhook-stubs/blob/develop/sse/tests/json/externalPrice-req.json) to you catalog.


##### OCC version 16+

### Instructions
1.  Generate an extension id and update the ext.json;
2.  Zip and package widget
3.  Upload the widget using the extextions manger in the OCC Admin

If you want to test this with a dummy pricing object you can use the /externalPrice [occ-sse-webhook-stubs](https://github.com/leedium/occ-sse-webhook-stubs "Webhook stubs for OCC")

