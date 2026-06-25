import { PageHeader } from "@components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card";
import { mascotas, clientes, tipoMascotas } from "@services";

function MascotasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mascotas"
        description="Consulta las mascotas registradas y sus datos básicos."
      />

      <Card>
        <CardHeader>
          <CardTitle>Mascotas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Dueño</th>
                  <th className="px-4 py-3">Apodos</th>
                  <th className="px-4 py-3">Alergias</th>
                </tr>
              </thead>
              <tbody>
                {mascotas.map((mascota) => {
                  const tipo = tipoMascotas.find((item) => item.id === mascota.tipomas);
                  const cliente = clientes.find((item) => item.id === mascota.idcliente);

                  return (
                    <tr key={mascota.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 align-top">{mascota.nombmas}</td>
                      <td className="px-4 py-3 align-top">{tipo?.nombre ?? "-"}</td>
                      <td className="px-4 py-3 align-top">{cliente ? `${cliente.nombcli} ${cliente.apecli}` : "-"}</td>
                      <td className="px-4 py-3 align-top">{mascota.apodos}</td>
                      <td className="px-4 py-3 align-top">{mascota.alergias}</td>
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

export default MascotasPage;
