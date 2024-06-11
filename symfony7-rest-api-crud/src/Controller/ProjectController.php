<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Project;


#[Route('/api', name: 'api_')]
class ProjectController extends AbstractController
{
    #[Route('/projects', name: 'project_index', methods: ['get'])]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $projects = $entityManager->getConnection()->fetchAllAssociative("SELECT * FROM project");

        if (!$projects) {

            return $this->json('No project found', 404);
        }

        return $this->json($projects);
    }


    #[Route('/projects', name: 'project_create', methods: ['post'])]
    public function create(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $project = new Project();
        $project->setName($request->request->get('name'));
        $project->setDescription($request->request->get('description'));

        $entityManager->persist($project);
        $entityManager->flush();

        $data =  [
            'id' => $project->getId(),
            'name' => $project->getName(),
            'description' => $project->getDescription(),
        ];

        return $this->json($data);
    }


    #[Route('/projects/{id}', name: 'project_show', methods: ['get'])]
    public function show(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        try {
            $project = $entityManager->getConnection()->fetchAssociative("SELECT * FROM project WHERE id = $id")[0];

            if (!$project) {

                return $this->json('No project found for id ' . $id, 404);
            }

            return $this->json($project);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    #[Route('/projects/{id}', name: 'project_update', methods: ['put', 'patch'])]
    public function update(EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        $project = $entityManager->getConnection()->fetchAssociative("SELECT * FROM project WHERE id = $id")[0];

        if (!$project) {
            return $this->json('No project found for id ' . $id, 404);
        }

        $name = $request->request->get('name');
        $description = $request->request->get('description');

        try {
            $entityManager->getConnection()->executeStatement("UPDATE project SET name = '{$name}', description = '{$description}' WHERE id = $id");
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

        $data =  [
            'id' => $id,
            'name' => $name,
            'description' => $description,
        ];

        return $this->json($data);
    }

    #[Route('/projects/{id}', name: 'project_delete', methods: ['delete'])]
    public function delete(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        try {
            $entityManager->getConnection()->executeStatement("DELETE FROM project WHERE id = $id");
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

        return $this->json('Deleted a project successfully with id ' . $id);
    }
}
