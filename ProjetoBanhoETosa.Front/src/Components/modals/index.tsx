import { useState } from "react";

export function AddClientPlan(){
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, customerName: 'Pedro Costa', planName: 'Plano Básico', startDate: '2025-10-01', endDate: '2025-10-31', price: 200, servicesUsed: 1, servicesAvailable: 4, paymentStatus: 'pago' },
    { id: 2, customerName: 'Ana Lima', planName: 'Plano Premium', startDate: '2025-10-05', endDate: '2025-11-05', price: 350, servicesUsed: 3, servicesAvailable: 8, paymentStatus: 'pendente' }
  ]);
  const [newSubscription, setNewSubscription] = useState({
    customerName: '',
    phone: '',
    email: '',
    planName: 'Plano Básico',
    startDate: '',
    servicesAvailable: 4,
    price: 200,
    paymentMethod: 'pix',
    paymentStatus: 'pendente'
  });
   const plans = [
    { id: 1, name: 'Plano Básico', price: 200, services: 4, description: '4 serviços por mês' },
    { id: 2, name: 'Plano Premium', price: 350, services: 8, description: '8 serviços por mês' },
    { id: 3, name: 'Plano VIP', price: 500, services: 12, description: '12 serviços por mês' }
  ];
  const handlePlanChange = (planName) => {
    const plan = plans.find(p => p.name === planName);
    if (plan) {
      setNewSubscription({
        ...newSubscription,
        planName: plan.name,
        servicesAvailable: plan.services,
        price: plan.price
      });
    }
  };
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(false);
  const handleAddSubscription = () => {
    if (!newSubscription.customerName || !newSubscription.phone || !newSubscription.startDate) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const startDate = new Date(newSubscription.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const newId = Math.max(...subscriptions.map(s => s.id), 0) + 1;
    const newSub = {
      id: newId,
      customerName: newSubscription.customerName,
      planName: newSubscription.planName,
      startDate: newSubscription.startDate,
      endDate: endDate.toISOString().split('T')[0],
      price: newSubscription.price,
      servicesUsed: 0,
      servicesAvailable: newSubscription.servicesAvailable,
      paymentStatus: newSubscription.paymentStatus
    };

    setSubscriptions([...subscriptions, newSub]);
    setNewSubscription({
      customerName: '',
      phone: '',
      email: '',
      planName: 'Plano Básico',
      startDate: '',
      servicesAvailable: 4,
      price: 200,
      paymentMethod: 'pix',
      paymentStatus: 'pendente'
    });
    setShowAddSubscriptionModal(false);
    alert('Cliente cadastrado no plano com sucesso!');
  };
    return(
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddSubscriptionModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Cliente em Plano</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubscription.customerName}
                  onChange={(e) => setNewSubscription({ ...newSubscription, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newSubscription.phone}
                  onChange={(e) => setNewSubscription({ ...newSubscription, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
                <input
                  type="email"
                  value={newSubscription.email}
                  onChange={(e) => setNewSubscription({ ...newSubscription, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="joao@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escolha o Plano <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.name)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        newSubscription.planName === plan.name
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800">{plan.name}</h4>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600">R$ {plan.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">por mês</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newSubscription.startDate}
                  onChange={(e) => setNewSubscription({ ...newSubscription, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">O plano terá validade de 30 dias a partir desta data</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select
                  value={newSubscription.paymentMethod}
                  onChange={(e) => setNewSubscription({ ...newSubscription, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status do Pagamento</label>
                <select
                  value={newSubscription.paymentStatus}
                  onChange={(e) => setNewSubscription({ ...newSubscription, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Resumo do Plano</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plano:</span>
                    <span className="font-semibold">{newSubscription.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Serviços incluídos:</span>
                    <span className="font-semibold">{newSubscription.servicesAvailable} serviços/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Valor mensal:</span>
                    <span className="font-semibold text-purple-600">R$ {newSubscription.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddSubscriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddSubscription}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Cadastrar no Plano
                </button>
              </div>
            </div>
          </div>
        </div>
      
    );
}
