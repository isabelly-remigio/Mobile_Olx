// app/(tabs)/styles/carrinho.styles.ts
import { StyleSheet } from 'react-native';
import { theme } from '../../src/theme/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleHeader: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
        marginLeft: theme.spacing.sm,
    },
    actionsBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray200,
        backgroundColor: theme.colors.white,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray700,
        marginLeft: theme.spacing.xs,
    },
    removeSelectedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.sm,
    },
    removeSelectedText: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.fonts.body,
        color: theme.colors.error,
        marginLeft: theme.spacing.xs,
    },
    checkboxItem: {
        padding: 0,
        margin: 0,
        marginRight: theme.spacing.sm,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    listContent: {
        paddingBottom: theme.spacing.xl,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        backgroundColor: theme.colors.white,
        minHeight: 100,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.gray100,
        marginRight: theme.spacing.md,
    },
    productInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
        marginBottom: 4,
        lineHeight: 20,
    },
    productPrice: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.primary[600],
        marginBottom: theme.spacing.sm,
    },
    itemControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
    },
    quantityButton: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        minWidth: 36,
        alignItems: 'center',
    },
    quantityText: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: theme.spacing.sm,
    },
    summaryContainer: {
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray200,
        backgroundColor: theme.colors.white,
        ...theme.shadows.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray600,
    },
    summaryValue: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray300,
    },
    totalLabel: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
    },
    totalValue: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.primary[600],
    },
    checkoutButton: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    checkoutButtonDisabled: {
        backgroundColor: theme.colors.gray300,
        opacity: 0.7,
    },
    checkoutButtonText: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.white,
        letterSpacing: 0.5,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing['3xl'],
    },
    emptyScroll: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    emptyDescription: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray600,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    exploreButton: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
    },
    exploreButtonText: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.white,
    },

    offlineIcon: {
    marginLeft: theme.spacing.xs,
},

headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
},

syncButton: {
    padding: theme.spacing.xs,
},

itemIndisponivel: {
    opacity: 0.6,
    backgroundColor: theme.colors.gray50,
},

productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
},

indisponivelBadge: {
    backgroundColor: theme.colors.warningLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
    marginLeft: theme.spacing.sm,
},

indisponivelText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.fonts.body,
    color: theme.colors.warning,
    fontWeight: theme.typography.weights.medium,
},

priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
},

subtotalText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.gray600,
    fontWeight: theme.typography.weights.medium,
},

buttonDisabled: {
    opacity: 0.5,
},

textDisabled: {
    color: theme.colors.gray400,
},

offlineWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
},

offlineWarningText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.warning,
    marginLeft: theme.spacing.xs,
    flex: 1,
},

clearCartButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.lg,
},

clearCartText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.fonts.body,
    color: theme.colors.error,
    fontWeight: theme.typography.weights.medium,
},
});