package repositories

import (
	"github.com/google/uuid"
	"github.com/jolneetanky/dateideas/apps/backend/api/app/domain/entity"
)

type MockResultRepository interface {
	GetResultsByJobId(jobId uuid.UUID, page int, limit int) (results []entity.Result, err error)
}

type MockResultRepositoryImpl struct {
}

func InitMockResultRepoImpl() MockResultRepositoryImpl {
	return MockResultRepositoryImpl{}
}

// implement methods
func (rr MockResultRepositoryImpl) GetResultsByJobId(jobId uuid.UUID, page int, limit int) (results []entity.Result, err error) {
	nodeIDs := []string{
		"133662122", "395054494", "410464090", "410464092", "410464097",
		"410464100", "410464103", "410464105", "410464108", "410464111",
		"410464114", "410464117", "410467188", "410467190", "410467197",
		"410467201", "410467203", "410467206", "410467207", "410467214",
	}

	for i, nodeID := range nodeIDs {
		results = append(results, entity.Result{
			ID:          uint(i + 1),
			JobID:       jobId,
			Description: "A great outdoor spot for a peaceful date.",
			NodeID:      nodeID,
		})
	}

	return results, nil
}
