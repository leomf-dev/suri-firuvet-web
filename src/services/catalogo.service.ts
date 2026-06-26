import { soapCallList } from "@api/soap";
import { SOAP, SOAP_OPS } from "@constants/index";
import type { TipoMascota, TipoCita, Clinica } from "@appTypes";

export const catalogoService = {
  getTiposMascota: () =>
    soapCallList<TipoMascota>(SOAP.CATALOGOS, SOAP_OPS.OBTENER_TIPOS_MASCOTA),

  getTiposCita: () =>
    soapCallList<TipoCita>(SOAP.CATALOGOS, SOAP_OPS.OBTENER_TIPOS_CITA),

  getClinicas: () =>
    soapCallList<Clinica>(SOAP.CATALOGOS, SOAP_OPS.OBTENER_CLINICAS),
};
