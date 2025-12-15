import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { OrderDTO } from "@/services/orders";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getOrderStatus } from "@/utils/format";

// Register fonts if needed, using standard fonts for now
// Font.register({ family: 'Roboto', src: 'path/to/font.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#112233",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#112233",
  },
  companyInfo: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
  },
  label: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    marginBottom: 8,
    color: "#000",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  orderInfo: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#e0e0e0",
    marginTop: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#e0e0e0",
    padding: 5,
  },
  tableColDesc: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#e0e0e0",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
  totalSection: {
    marginTop: 20,
    alignItems: "flex-end",
    paddingRight: 10,
  },
  totalRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: "right",
    paddingRight: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#999",
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
});

interface OrderPDFProps {
  order: OrderDTO;
}

export const OrderPDF = ({ order }: OrderPDFProps) => {
  const formattedDate = order.createdAt
    ? format(new Date(order.createdAt), "dd 'de' MMMM, yyyy HH:mm", { locale: es })
    : "N/A";

  const statusInfo = getOrderStatus(order.status || "Pending");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Orden de Compra</Text>
          <View style={styles.companyInfo}>
            <Text>Tienda UCN</Text>
            <Text>Av. Angamos 0610</Text>
            <Text>Antofagasta, Chile</Text>
            <Text>contacto@tiendaucn.cl</Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.label}>Código de Orden:</Text>
          <Text style={styles.value}>{order.code}</Text>

          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{formattedDate}</Text>

          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>{statusInfo.label}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColDesc}>
              <Text style={styles.tableCellHeader}>Producto</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Precio Unit.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Cantidad</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {/* Table Rows */}
          {order.orderItems.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.tableColDesc}>
                <Text style={styles.tableCell}>{item.titleAtMoment}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrice(item.priceAtMoment)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatPrice(item.priceAtMoment * item.quantity)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatPrice(order.subTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={[styles.totalValue, { fontWeight: "bold" }]}>
              {formatPrice(order.total)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gracias por tu compra en Tienda UCN. Este documento es un comprobante válido.</Text>
        </View>
      </Page>
    </Document>
  );
};
