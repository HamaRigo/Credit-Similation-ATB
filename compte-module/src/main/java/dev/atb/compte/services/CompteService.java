package dev.atb.compte.services;

import dev.atb.compte.repo.CompteRepository;
import dev.atb.models.Compte;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


    @Service
    public class CompteService {
        @Autowired
        private CompteRepository compteRepository;

        public Compte findById(String numeroCompte) {
            return compteRepository.findById(numeroCompte).orElse(null);
        }

        public List<Compte> findAll() {
            return compteRepository.findAll();
        }

        public Compte save(Compte compte) {
            return compteRepository.save(compte);
        }

        public void deleteById(String id) {
            compteRepository.deleteById(id);
        }
    }
