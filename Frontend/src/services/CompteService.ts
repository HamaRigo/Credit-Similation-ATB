import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';
import { TypeCompteEnum } from "../types/TypeCompteEnum";

class CompteService {
    list_comptes() {
        return axios.get(apiRoutes.COMPTE_URL);
    }

    count_comptes_by_status() {
        return axios.get(apiRoutes.COMPTE_URL + `/countByStatus`);
    }

    count_comptes_by_type() {
        return axios.get(apiRoutes.COMPTE_URL + `/countByType`);
    }

    count_comptes_by_month(year: string) {
        return axios.get(apiRoutes.COMPTE_URL + `/countByMonth`, {
            params: {
                year: year,
            },
        });
    }

    get_compte(id: number) {
        return axios.get(apiRoutes.COMPTE_URL + `/${id}`);
    }

    compte_exists(numeroCompte: string) {
        return axios.get(apiRoutes.COMPTE_URL + '/exists', {
            params: {
                numeroCompte: numeroCompte,
            },
        });
    }

    add_compte(data: any) {
        if (data.typeCompte == TypeCompteEnum.COURANT) {
            return axios.post(apiRoutes.COMPTE_URL + '/current', data);
        }
        return axios.post(apiRoutes.COMPTE_URL + '/saving', data);
    }

    edit_compte(data: any) {
        if (data.typeCompte == TypeCompteEnum.COURANT) {
            return axios.put(apiRoutes.COMPTE_URL + '/current', data);
        }
        else if(data.typeCompte == TypeCompteEnum.EPARGNE) {
            return axios.put(apiRoutes.COMPTE_URL + '/saving', data);
        }
    }

    delete_compte(id: number) {
        return axios.delete(apiRoutes.COMPTE_URL + `/${id}`);
    }
}

export default new CompteService();