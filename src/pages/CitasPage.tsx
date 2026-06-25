import { PageHeader } from "@components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { citas, clinicas, clientes, mascotas, tipoCitas } from "@services";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function CitasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Citas"
        description="Revisa las agendas y el estado de las citas programadas."
        action={
          <Button variant="secondary" className="rounded-full">
            Nueva cita
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Agenda de citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Mascota</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Clínica</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => {
                  const cliente = clientes.find((item) => item.id === cita.idcliente);
                  const mascota = mascotas.find((item) => item.id === cita.idmascota);
                  const tipo = tipoCitas.find((item) => item.id === cita.tipocita);
                  const clinica = clinicas.find((item) => item.id === cita.idclinica);

                  return (
                    <tr key={cita.idcita} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 align-top">{formatDate(cita.fecha)}</td>
                      <td className="px-4 py-3 align-top">
                        {cliente ? `${cliente.nombcli} ${cliente.apecli}` : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">{mascota?.nombmas ?? "-"}</td>
                      <td className="px-4 py-3 align-top">{tipo?.nombre ?? "-"}</td>
                      <td className="px-4 py-3 align-top">{clinica?.nombre ?? "-"}</td>
                      <td className="px-4 py-3 align-top text-sm font-semibold text-teal-700">
                        {cita.estado}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CitasPage;
