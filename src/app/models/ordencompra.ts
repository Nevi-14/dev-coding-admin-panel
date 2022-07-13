
export class OrdenCompra{

    constructor(

     public  DETALLE_DIR_EMB: string,
     public TIPO_CAMBIO: string,
     public BODEGA_DEFAULT: string,
     public ULT_SOLICITUD: string ,
     public  ULT_ORDEN_COMPRA: string,
     public  ULT_EMBARQUE: string,
     public   ULT_CRM: string,
     public   ULT_SOLICITUD_M: string,
     public   ULT_ORDEN_COMPRA_M: string,
     public   ULT_EMBARQUE_M: string,
     public   USAR_RUBROS: string,
     public   RUBRO1_NOMBRE: string,
     public   RUBRO2_NOMBRE: string,
     public   RUBRO3_NOMBRE: string,
     public   RUBRO4_NOMBRE: string,
     public   RUBRO5_NOMBRE: string,
     public   PRECIO_DEC: number,
     public   CANTIDAD_DEC: number,
     public   MAX_PORC_AUMENTO: number,
     public  IMP1_AFECTA_DESCTO: string,
     public  FACTOR_REDONDEO: number,
     public  DIRECCION_EMBARQUE: string,
     public   DIRECCION_COBRO: string,
     public  TRAER_LINEAS_NULAS: string,
     public   RECHAZ_AUMEN_BKORD: string,
     public   CONSOLIDAR_LINEAS: string,
     public    AGREGAR_INTERSECCI: string,
     public   TIPO_ASIENTO: string,
     public   PAQUETE: string,
     public   MOD_APLIC_ASIENTO: number,
     public   INTEGRACION_CONTA: string,
     public   TIPO_CONTA_OMISION: string,
     public   CTR_TRANSITO_LOCAL: string,
     public   CTA_TRANSITO_LOCAL: string,
     public   CTR_TRANSITO_EXT: string,
     public    CTA_TRANSITO_EXT: string,
     public    TIPO_LIQ_OMISION: string,
     public    POR_VARIAC_COSTO: number,
     public    PEDIDOS_SOLICITUD: string,
     public   PEDIDOS_ORDEN: string,
     public  PEDIDOS_EMBARQUE: string,
     public  EMBARQUE_PREVIO: string,
     public  ULT_LIQUIDACION: string,
     public  ULT_LIQUIDACION_M: string,
     public  OC_EN_DOS_MONEDAS: string,
     public   ORDEN_OBSERVACION: string,
     public   DETALLE_DIR_COB: string,
     public   PORCOSTO_ANTESIMP: string,
     public   CP_EN_LINEA: string,
     public   TIPO_PRORRATEO: string,
     public   RECMAS_AFECTABACK: string,
     public    DEMAS_SEPAGA: string,
     public   ULT_DEVOLUCION: string,
     public   ULT_DEVOLUCION_M: string,
     public   CODIGO_DEVOLUCION: string,
     public   CONSECUTIVO_CI: string,
     public   INTEGRACION_CR: string,
     public   PAQUETE_CR: string,
     public   PRESUPUESTO_CR: string,
     public   CTR_CTA_COMPRAS: string,
     public  PRORRATEO_OC_CR: string,
     public  UNICO_CTR_OC: string,
     public   PERMITE_SOBREGIRO: string,
     public   RUBRO1_SOLNOM: string,
     public   RUBRO2_SOLNOM: string,
     public   RUBRO3_SOLNOM: string,
     public   RUBRO4_SOLNOM: string,
     public   RUBRO5_SOLNOM: string,
     public    RUBRO1_EMBNOM: string,
     public    RUBRO2_EMBNOM: string,
     public   RUBRO3_EMBNOM: string,
     public   RUBRO4_EMBNOM: string,
     public  RUBRO5_EMBNOM: string,
     public  APLICAR_NC: string,
     public   TIENE_FACTURA: string,
     public   MAXIMO_LINORDEN: number,
     public   IMP2_SE_AFECTA: string,
     public   PROM_RECALC_COSTO: string,
     public   PROM_RECALC_SIN_COSTO: string,
     public   CAPAS_CONT_VARIACION: string,
     public   CAPAS_APLIC_VARIACION: string,
     public  CAPAS_AFEC_CAPA_RESPEC: string,
     public  CAPAS_AFEC_PRIMER_CAPA: string,
     public  CAPAS_AFEC_OTRAS_CAPAS: string,
     public   SIMPLIFICA_COMPRA: string,
     public   NoteExistsFlag: number,
     public  RecordDate: string,
     public   RowPointer: string,
     public  CreatedBy: string,
     public  UpdatedBy: string,
     public  CreateDate: string,
     public   OC_TIPO_SUG_MONTOS: string,
     public   OC_PRORRATEAR_DIF_EMB: string,
     public  OC_DIFERENCIA_EN_OC: string,
     public  OC_ARTICULO_COMODIN: string,
     public  OC_PORC_VAR_ADV: number,
     public  OC_PORC_VAR_ERROR: number,
     public   OC_CONSOLI_VAL_LINEA: string,
     public   OC_CONSOLI_VAL_GUARDAR: string,
     public   OC_TIPO_SUG_TCANT: string,
     public   APROBAR_OC_JERARQUIA: string,
     public   CANT_DIAS_ENV_NOTIF: number,
     public   CRIT_EVAL_PROV1: string,
     public    CRIT_EVAL_PROV2: string,
     public   CRIT_EVAL_PROV3: string,
     public    CRIT_EVAL_PROV4: string,
     public   CRIT_EVAL_PROV5: string,
     public   CRIT_EVAL_PROV6: string,
     public   CRIT_EVAL_PROV7: string,
     public   CRIT_EVAL_PROV8: string,
     public   CRIT_EVAL_PROV9: string,
     public    CRIT_EVAL_PROV10: string,
     public   PESO_CRIT_EVAL_PROV1: string,
     public   PESO_CRIT_EVAL_PROV2: string,
     public    PESO_CRIT_EVAL_PROV3: string,
     public    PESO_CRIT_EVAL_PROV4: string,
     public   PESO_CRIT_EVAL_PROV5: string,
     public   PESO_CRIT_EVAL_PROV6: string,
     public   PESO_CRIT_EVAL_PROV7: string,
     public   PESO_CRIT_EVAL_PROV8: string,
     public   PESO_CRIT_EVAL_PROV9: string,
     public   PESO_CRIT_EVAL_PROV10: string,
     public   FREC_APLICA_EVAL_PROV: string,
     public   CRIT_PERMANENCIA: string,
     public   ESCALA_EVALUACION: string,
     public   SUGERIR_FECHA: string
    ){}
}